import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import java.util.Date;
public class TestJwtExp {
    public static void main(String[] args) {
        String token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiIxNyIsInVuaXF1ZV9uYW1lIjoiZW1pbHkuY2hlbkBjYXJnb3guY29tIiwicm9sZSI6IlJPTEVfQ1VTVE9NRVIiLCJuYmYiOjE3ODU0MzA1NzAsImV4cCI6MTc4NTUxNjk3MCwiaWF0IjoxNzg1NDMwNTcwfQ.gN75NpXWN0Wmme0h-9X8DVXDFZGEgTjBSV8RjQYv5kEiTNZpgDRgiFKY54wNDmMb-cbs7HAE5_PbBy8rSlkrHg";
        String secret = "94a08da1fecbb6e8b46990538c7b50b2a7516-4d10-4bd4-bd97-3be18d52c7dc";
        try {
            Claims claims = Jwts.parserBuilder().setSigningKey(Keys.hmacShaKeyFor(secret.getBytes())).build().parseClaimsJws(token).getBody();
            Date exp = claims.getExpiration();
            System.out.println("Expiration: " + exp);
            System.out.println("Is Expired: " + exp.before(new Date()));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
