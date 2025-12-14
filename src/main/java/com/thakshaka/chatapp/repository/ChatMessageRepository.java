package com.thakshaka.chatapp.repository;

import com.thakshaka.chatapp.entity.ChatMessageEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {
    
    Page<ChatMessageEntity> findByOrderByCreatedAtDesc(Pageable pageable);
    
    List<ChatMessageEntity> findByCreatedAtAfterOrderByCreatedAtAsc(LocalDateTime after);
}
