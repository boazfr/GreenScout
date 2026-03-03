package com.greenscout.api.controller;

import com.greenscout.api.model.AppUser;
import com.greenscout.api.repository.AppUserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserRepository userRepository;

    public AuthController(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        String email = principal.getAttribute("email");
        AppUser user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "name", user.getName() != null ? user.getName() : "",
                "pictureUrl", user.getPictureUrl() != null ? user.getPictureUrl() : ""
        ));
    }
}
