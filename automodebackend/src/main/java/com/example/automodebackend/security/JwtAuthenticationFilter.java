package com.example.automodebackend.security;

import io.jsonwebtoken.Jwts;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Value("${jwt.secret}")
    private String SECRET_KEY;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // Ignorer les requêtes OPTIONS (CORS preflight)
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }
        
        // Ignorer les endpoints publics
        String path = request.getRequestURI();
        if (path.contains("/signInUser") || path.contains("/createUser") || 
            path.contains("/search") || path.contains("/random")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            String header = request.getHeader("Authorization");
            
            if (header != null && header.startsWith("Bearer ")) {
                String token = header.substring(7); // Enlever "Bearer "
                
                String username = Jwts.parser()
                        .setSigningKey(SECRET_KEY.getBytes(StandardCharsets.UTF_8))
                        .parseClaimsJws(token)
                        .getBody()
                        .getSubject();
                
                if (username != null) {
                    List<SimpleGrantedAuthority> authorities = Arrays.asList(new SimpleGrantedAuthority("ROLE_USER"));
                    UsernamePasswordAuthenticationToken auth = 
                            new UsernamePasswordAuthenticationToken(username, null, authorities);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        } catch (Exception e) {
            // Token invalide, continuer sans authentification
            SecurityContextHolder.clearContext();
        }
        
        filterChain.doFilter(request, response);
    }
}
