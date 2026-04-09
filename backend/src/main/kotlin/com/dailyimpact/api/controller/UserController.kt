package com.dailyimpact.api.controller

import com.dailyimpact.api.dto.PublicUserResponse
import com.dailyimpact.api.dto.UpdateProfileRequest
import com.dailyimpact.api.dto.UserResponse
import com.dailyimpact.api.service.UserService
import jakarta.validation.Valid
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/users")
class UserController(private val userService: UserService) {

    @GetMapping("/me")
    fun getMe(@AuthenticationPrincipal principal: UserDetails): UserResponse =
        userService.getMe(principal.username)

    @PutMapping("/me")
    fun updateMe(
        @AuthenticationPrincipal principal: UserDetails,
        @Valid @RequestBody request: UpdateProfileRequest,
    ): UserResponse = userService.updateMe(principal.username, request)

    @GetMapping("/{id}")
    fun getUser(@PathVariable id: String): PublicUserResponse =
        userService.getPublicProfile(id)

    @GetMapping("/search")
    fun searchByEmail(@RequestParam email: String): PublicUserResponse =
        userService.searchByEmail(email)
}
