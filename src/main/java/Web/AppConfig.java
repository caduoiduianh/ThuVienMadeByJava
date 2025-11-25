package Web;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import Service.LibraryService;

@Configuration
public class AppConfig {
    @Bean
    public LibraryService libraryService() {
        // Run current LibraryService
        return new LibraryService();
    }
}
