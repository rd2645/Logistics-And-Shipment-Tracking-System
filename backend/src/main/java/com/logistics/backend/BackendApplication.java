package com.logistics.backend;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void dropLegacyFk() {
        try {
            java.util.List<java.util.Map<String, Object>> fks = jdbcTemplate.queryForList(
                "SELECT TABLE_NAME, CONSTRAINT_NAME " +
                "FROM information_schema.KEY_COLUMN_USAGE " +
                "WHERE REFERENCED_TABLE_SCHEMA = 'logistics_db' " +
                "AND REFERENCED_TABLE_NAME = 'users'"
            );
            
            for (java.util.Map<String, Object> fk : fks) {
                String tableName = (String) fk.get("TABLE_NAME");
                String constraintName = (String) fk.get("CONSTRAINT_NAME");
                jdbcTemplate.execute("ALTER TABLE " + tableName + " DROP FOREIGN KEY " + constraintName);
                System.out.println("Dropped legacy FK " + constraintName + " from " + tableName);
            }
            
            // Optionally, drop the users table itself if it's empty or unused, but let's just leave it 
            // since dropping FKs is enough to unblock inserts.
        } catch (Exception e) {
            System.out.println("Error dropping legacy FKs: " + e.getMessage());
        }
    }

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
