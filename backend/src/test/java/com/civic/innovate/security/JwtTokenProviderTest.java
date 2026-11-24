package com.civic.innovate.security;

import com.civic.innovate.entity.Role;
import com.civic.innovate.entity.User;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    // 256-bit test key for unit test assertions (64 characters long)
    private static final String VALID_TEST_SECRET = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

    @Test
    @DisplayName("Startup validation fails if JWT secret is null")
    void shouldFailWhenSecretIsNull() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                new JwtTokenProvider(null, 86400000L));
        assertTrue(ex.getMessage().contains("JWT secret cannot be null or empty"));
    }

    @Test
    @DisplayName("Startup validation fails if JWT secret is blank")
    void shouldFailWhenSecretIsBlank() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                new JwtTokenProvider("   ", 86400000L));
        assertTrue(ex.getMessage().contains("JWT secret cannot be null or empty"));
    }

    @Test
    @DisplayName("Startup validation fails if JWT secret is shorter than 256 bits (32 bytes)")
    void shouldFailWhenSecretIsTooShort() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class, () ->
                new JwtTokenProvider("short-secret-under-32-bytes!", 86400000L));
        assertTrue(ex.getMessage().contains("at least 256 bits"));
    }

    @Test
    @DisplayName("Token generation and validation succeed with a valid 256-bit secret")
    void shouldGenerateAndValidateTokenSuccessfully() {
        JwtTokenProvider provider = new JwtTokenProvider(VALID_TEST_SECRET, 86400000L);

        User testUser = new User("citizen@civic.org", "hash", "Aarav Patel", Role.ROLE_CITIZEN);
        testUser.setId(java.util.UUID.randomUUID());
        String token = provider.generateToken(testUser);

        assertNotNull(token);
        assertTrue(provider.validateToken(token));
        assertEquals("citizen@civic.org", provider.getEmailFromToken(token));
    }
}
