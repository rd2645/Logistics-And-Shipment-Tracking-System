package com.logistics.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String userIdStr = null;
        String role = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            userIdStr = jwtUtil.extractClaim(token, claims -> {
                Object val = claims.get("http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier");
                return val != null ? val.toString() : null;
            });
            if (userIdStr == null) {
                userIdStr = jwtUtil.extractClaim(token, claims -> {
                    Object val = claims.get("nameid");
                    return val != null ? val.toString() : null;
                });
            }
            if (userIdStr == null) {
                userIdStr = jwtUtil.extractClaim(token, claims -> {
                    Object val = claims.get("sub");
                    return val != null ? val.toString() : null;
                });
            }
            
            role = jwtUtil.extractClaim(token, claims -> {
                Object val = claims.get("http://schemas.microsoft.com/ws/2008/06/identity/claims/role");
                return val != null ? val.toString() : null;
            });
            // C# JWT puts the role in a long schema URL by default if using ClaimTypes.Role.
        }

        if (userIdStr != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            if (jwtUtil.validateToken(token)) {
                // If the JWT doesn't have the long URL role claim (e.g. customized), try "role"
                if (role == null) {
                     role = jwtUtil.extractClaim(token, claims -> {
                         Object val = claims.get("role");
                         return val != null ? val.toString() : null;
                     });
                }

                SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role != null ? role : "ROLE_USER");

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userIdStr, null, Collections.singletonList(authority));
                
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }
}
