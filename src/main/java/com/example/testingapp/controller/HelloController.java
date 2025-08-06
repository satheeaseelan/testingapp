package com.example.testingapp.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HelloController {

    @GetMapping("/")
    public String index() {
        return "index.html";
    }

    @GetMapping("/health")
    @ResponseBody
    public String health() {
        return "Application is running!";
    }
}
