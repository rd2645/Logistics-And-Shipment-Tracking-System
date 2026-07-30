import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
public class TestJwt {
    public static void main(String[] args) {
        String token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNyIsInVuaXF1ZV9uYW1lIjoiZW1pbHkuY2hlbkBjYXJnb3guY29tIiwicm9sZSI6IlJPTEVfQ1VTVE9NRVIiLCJuYmYiOjE3ODU0MjkxOTcsImV4cCI6MTc4NTUxNTU5NywiaWF0IjoxNzg1NDI5MTk3fQ.CnyHj2SRq867rJ05i5Y90e36Yzhj9V0mweNCy4-4xZZMfmrrO3NmluOa3F2Nk2n0g0Zt2L21r2FRJfepqNyEqA";
        String secret = "94a08da1fecbb6e8b46990538c7b50b2a7516-4d10-4bd4-bd97-3be18d52c7dc";
        try {
            var claims = Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(secret.getBytes())).build().parseClaimsJws(token).getBody();
            System.out.println("Success: " + claims);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
