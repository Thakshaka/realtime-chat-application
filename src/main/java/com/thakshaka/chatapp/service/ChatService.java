package com.thakshaka.chatapp.service;

import com.thakshaka.chatapp.chat.ChatMessage;
import com.thakshaka.chatapp.chat.MessageType;
import com.thakshaka.chatapp.entity.ChatMessageEntity;
import com.thakshaka.chatapp.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final CacheService cacheService;

    @Transactional
    public ChatMessage saveMessage(ChatMessage chatMessage) {
        ChatMessageEntity entity = ChatMessageEntity.builder()
                .sender(chatMessage.getSender())
                .content(chatMessage.getContent())
                .type(chatMessage.getType())
                .build();

        ChatMessageEntity saved = chatMessageRepository.save(entity);
        
        // Cache the message in Redis
        cacheService.cacheRecentMessage(chatMessage);
        
        log.info("Message saved: {} from {}", saved.getContent(), saved.getSender());
        
        return ChatMessage.builder()
                .content(saved.getContent())
                .sender(saved.getSender())
                .type(saved.getType())
                .build();
    }

    @Transactional
    public ChatMessage handleUserJoin(String username) {
        ChatMessage joinMessage = ChatMessage.builder()
                .sender(username)
                .type(MessageType.JOIN)
                .content(username + " has joined the chat!")
                .build();

        // Save join event
        saveMessage(joinMessage);
        
        // Add to online users
        cacheService.addOnlineUser(username);
        
        return joinMessage;
    }

    @Transactional
    public ChatMessage handleUserLeave(String username) {
        ChatMessage leaveMessage = ChatMessage.builder()
                .sender(username)
                .type(MessageType.LEAVE)
                .content(username + " has left the chat!")
                .build();

        // Save leave event
        saveMessage(leaveMessage);
        
        // Remove from online users
        cacheService.removeOnlineUser(username);
        
        return leaveMessage;
    }

    public List<ChatMessage> getRecentMessages(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        return chatMessageRepository.findByOrderByCreatedAtDesc(pageable)
                .getContent()
                .stream()
                .map(entity -> ChatMessage.builder()
                        .content(entity.getContent())
                        .sender(entity.getSender())
                        .type(entity.getType())
                        .build())
                .collect(Collectors.toList());
    }
}
