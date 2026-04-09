package com.dailyimpact.api.exception

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

data class ErrorResponse(val message: String, val errors: Map<String, String> = emptyMap())

@RestControllerAdvice
class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException::class)
    fun handleNotFound(e: ResourceNotFoundException) =
        ResponseEntity.status(HttpStatus.NOT_FOUND).body(ErrorResponse(e.message!!))

    @ExceptionHandler(ConflictException::class)
    fun handleConflict(e: ConflictException) =
        ResponseEntity.status(HttpStatus.CONFLICT).body(ErrorResponse(e.message!!))

    @ExceptionHandler(ForbiddenException::class)
    fun handleForbidden(e: ForbiddenException) =
        ResponseEntity.status(HttpStatus.FORBIDDEN).body(ErrorResponse(e.message!!))

    @ExceptionHandler(BadRequestException::class)
    fun handleBadRequest(e: BadRequestException) =
        ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ErrorResponse(e.message!!))

    @ExceptionHandler(BadCredentialsException::class)
    fun handleBadCredentials(e: BadCredentialsException) =
        ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ErrorResponse("Invalid email or password"))

    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(e: MethodArgumentNotValidException): ResponseEntity<ErrorResponse> {
        val errors = e.bindingResult.allErrors.associate { error ->
            val field = if (error is FieldError) error.field else "global"
            field to (error.defaultMessage ?: "Invalid value")
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ErrorResponse("Validation failed", errors))
    }
}
