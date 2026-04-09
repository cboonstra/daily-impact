package com.dailyimpact.api

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class DailyImpactApplication

fun main(args: Array<String>) {
    runApplication<DailyImpactApplication>(*args)
}
