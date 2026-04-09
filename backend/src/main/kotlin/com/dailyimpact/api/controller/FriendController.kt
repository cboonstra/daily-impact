package com.dailyimpact.api.controller

import com.dailyimpact.api.dto.FriendRequestResponse
import com.dailyimpact.api.dto.FriendResponse
import com.dailyimpact.api.dto.SendFriendRequestByEmail
import com.dailyimpact.api.service.FriendService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/friends")
class FriendController(private val friendService: FriendService) {

    @GetMapping
    fun getFriends(@AuthenticationPrincipal principal: UserDetails): List<FriendResponse> =
        friendService.getFriends(principal.username)

    @PostMapping("/requests")
    @ResponseStatus(HttpStatus.CREATED)
    fun sendRequest(
        @AuthenticationPrincipal principal: UserDetails,
        @Valid @RequestBody request: SendFriendRequestByEmail,
    ): FriendRequestResponse = friendService.sendFriendRequest(principal.username, request)

    @GetMapping("/requests")
    fun getIncomingRequests(
        @AuthenticationPrincipal principal: UserDetails,
    ): List<FriendRequestResponse> = friendService.getIncomingRequests(principal.username)

    @PutMapping("/requests/{id}/accept")
    fun acceptRequest(
        @AuthenticationPrincipal principal: UserDetails,
        @PathVariable id: String,
    ): FriendRequestResponse = friendService.acceptRequest(principal.username, id)

    @PutMapping("/requests/{id}/decline")
    fun declineRequest(
        @AuthenticationPrincipal principal: UserDetails,
        @PathVariable id: String,
    ): FriendRequestResponse = friendService.declineRequest(principal.username, id)

    @DeleteMapping("/{friendId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun removeFriend(
        @AuthenticationPrincipal principal: UserDetails,
        @PathVariable friendId: String,
    ) = friendService.removeFriend(principal.username, friendId)
}
