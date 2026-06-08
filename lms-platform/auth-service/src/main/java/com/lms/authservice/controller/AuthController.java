package com.lms.authservice.controller;

import com.lms.authservice.constant.MessageConstants;
import com.lms.authservice.dto.AuthRequest;
import com.lms.authservice.dto.AuthResponse;
import com.lms.authservice.dto.RegisterRequest;
import com.lms.authservice.service.AuthService;
import com.lms.model.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new ApiResponse<>(true, MessageConstants.REGISTER_SUCCESS, response));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> authenticate(@RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request);
        return ResponseEntity.ok(new ApiResponse<>(true, MessageConstants.LOGIN_SUCCESS, response));
    }
}
