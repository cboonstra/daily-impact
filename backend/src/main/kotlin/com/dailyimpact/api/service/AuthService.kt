package com.dailyimpact.api.service

import com.dailyimpact.api.dto.AuthResponse
import com.dailyimpact.api.dto.LoginRequest
import com.dailyimpact.api.dto.RegisterRequest
import com.dailyimpact.api.dto.toResponse
import com.dailyimpact.api.exception.ConflictException
import com.dailyimpact.api.model.Progress
import com.dailyimpact.api.model.User
import com.dailyimpact.api.repository.ProgressRepository
import com.dailyimpact.api.repository.UserRepository
import com.dailyimpact.api.security.JwtTokenProvider
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val progressRepository: ProgressRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenProvider: JwtTokenProvider,
) {
    fun register(request: RegisterRequest): AuthResponse {
        if (userRepository.existsByEmail(request.email)) {
            throw ConflictException("Email already in use")
        }
        val user = userRepository.save(
            User(
                email = request.email,
                passwordHash = passwordEncoder.encode(request.password),
                name = request.name,
            )
        )
        // Initialise empty progress for the new user
        progressRepository.save(Progress(userId = user.id!!))
        val token = jwtTokenProvider.generateToken(user.id)
        return AuthResponse(token = token, user = user.toResponse())
    }

    fun login(request: LoginRequest): AuthResponse {
        val user = userRepository.findByEmail(request.email)
            .orElseThrow { BadCredentialsException("Invalid email or password") }
        if (!passwordEncoder.matches(request.password, user.passwordHash)) {
            throw BadCredentialsException("Invalid email or password")
        }
        val token = jwtTokenProvider.generateToken(user.id!!)
        return AuthResponse(token = token, user = user.toResponse())
    }
}
