package com.project.shopapp.configurations;

import com.project.shopapp.filters.JwtTokenFilter;
import com.project.shopapp.modules.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import java.util.Arrays;
import java.util.List;

import static org.springframework.http.HttpMethod.*;

@Configuration
@EnableWebSecurity(debug = true)
@EnableGlobalMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class WebSecurityConfig {
    private final JwtTokenFilter jwtTokenFilter;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeRequests(requests -> {
                    requests.requestMatchers("api/v1/users/register","api/v1/users/login").permitAll()


                            .requestMatchers(GET, "api/v1/users**").permitAll()
                            .requestMatchers(DELETE, "api/v1/users/**").hasAnyRole(Role.ADMIN)

                            //CATEGORIES
                            .requestMatchers(GET, "api/v1/categories**").permitAll()
                            .requestMatchers(POST,"api/v1/categories/**").hasAnyRole(Role.ADMIN)
                            .requestMatchers(PUT,"api/v1/categories/**").hasAnyRole(Role.ADMIN)
                            .requestMatchers(DELETE,"api/v1/categories/**").hasAnyRole(Role.ADMIN)

                            //PRODUCT
                            .requestMatchers(GET,"api/v1/products**").permitAll()
                            .requestMatchers(GET,"api/v1/products/**").permitAll()
                            .requestMatchers(GET, "api/v1/products/images**").permitAll()
                            .requestMatchers(POST,"api/v1/products**").hasAnyRole(Role.ADMIN)
                            .requestMatchers(PUT,"api/v1/products/**").hasAnyRole(Role.ADMIN)
                            .requestMatchers(DELETE,"api/v1/products/**").hasAnyRole(Role.ADMIN)

                            //ORDER
                            .requestMatchers(POST,"api/v1/orders/**").hasAnyRole(Role.USER)
                            .requestMatchers(GET,"api/v1/orders/**").permitAll()
                            .requestMatchers(PUT,"api/v1/orders/**").hasRole(Role.ADMIN)
                            .requestMatchers(DELETE,"api/v1/orders/**").hasRole(Role.ADMIN)

                            //ORDER_DETAILS
                            .requestMatchers(POST,"api/v1/order_details/**").hasAnyRole(Role.USER)
                            .requestMatchers(GET,"api/v1/order_details/**").permitAll()
                            .requestMatchers(PUT,"api/v1/order_details/**").hasRole(Role.ADMIN)
                            .requestMatchers(DELETE,"api/v1/order_details/**").hasRole(Role.ADMIN)

                            //Roles
                            .requestMatchers(GET,"api/v1/roles**").permitAll()

                            .anyRequest().authenticated();
                })
                .csrf(AbstractHttpConfigurer::disable);
        http.cors(new Customizer<CorsConfigurer<HttpSecurity>>() {
            @Override
            public void customize(CorsConfigurer<HttpSecurity> httpSecurityCorsConfigurer) {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(List.of("*"));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
                configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
                configuration.setExposedHeaders(List.of("x-auth-token"));
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                httpSecurityCorsConfigurer.configurationSource(source);
            }
        });
        return http.build();
    }
}
