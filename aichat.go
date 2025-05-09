package main

import (
	"context"
)

var aiconfig *Config

func aichat(prompt string) (string, error) {
	if aiconfig == nil {
		aiconfig = &Config{
			Host:  "localhost",
			Port:  11434,
			Model: "llama3.2",
		}
	}

	client := NewClient(*aiconfig)
	ctx := context.Background()
	stream := true
	response, err := client.SendRequest(ctx, prompt, stream, nil)
	if err != nil {
		return "", err
	}
	return response, nil
}
