package com.thakshaka.chatapp.service;

import com.thakshaka.chatapp.chat.ChatMessage;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class CacheService {

    private final RedisTemplate<String, String> redisTemplate;
    private final ObjectMapper objectMapper;
    
    private static final String ONLINE_USERS_KEY = "chat:online:users";
    private static final String RECENT_MESSAGES_KEY = "chat:messages:recent";
    private static final long MESSAGE_CACHE_TTL_HOURS = 1; // 1 hour
    private static final long USER_PRESENCE_TTL_MINUTES = 5; // 5 minutes

    // User Presence Management
    public void addOnlineUser(String username) {
        redisTemplate.opsForSet().add(ONLINE_USERS_KEY, username);
        redisTemplate.expire(ONLINE_USERS_KEY, USER_PRESENCE_TTL_MINUTES, TimeUnit.MINUTES);
        log.info("User {} is now online", username);
    }

    public void removeOnlineUser(String username) {
        redisTemplate.opsForSet().remove(ONLINE_USERS_KEY, username);
        log.info("User {} is now offline", username);
    }

    public Set<String> getOnlineUsers() {
        return redisTemplate.opsForSet().members(ONLINE_USERS_KEY);
    }

    public boolean isUserOnline(String username) {
        return Boolean.TRUE.equals(redisTemplate.opsForSet().isMember(ONLINE_USERS_KEY, username));
    }

    // Message Caching
    public void cacheRecentMessage(ChatMessage message) {
        try {
            String messageJson = objectMapper.writeValueAsString(message);
            redisTemplate.opsForList().leftPush(RECENT_MESSAGES_KEY, messageJson);
            redisTemplate.opsForList().trim(RECENT_MESSAGES_KEY, 0, 99); // Keep last 100 messages
            redisTemplate.expire(RECENT_MESSAGES_KEY, MESSAGE_CACHE_TTL_HOURS, TimeUnit.HOURS);
        } catch (JsonProcessingException e) {
            log.error("Error caching message", e);
        }
    }

    public void refreshUserPresence(String username) {
        redisTemplate.expire(ONLINE_USERS_KEY, USER_PRESENCE_TTL_MINUTES, TimeUnit.MINUTES);
    }
}
