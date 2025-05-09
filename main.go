package main

import (
	"log"
	"net/http"
	"path/filepath"
)

func main() {
	// Serve static files (CSS, JS)
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))

	// Serve main page
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" {
			http.NotFound(w, r)
			return
		}

		filePath := filepath.Join("templates", "base.html")
		http.ServeFile(w, r, filePath)
	})

	// Chat API handler
	http.HandleFunc("/api/chat", AIChatHandler)

	// Start server
	port := ":8080"
	log.Printf("Server running on http://localhost%s", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal(err)
	}
}
