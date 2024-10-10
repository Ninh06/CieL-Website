package com.project.shopapp.components;

import com.project.shopapp.utils.WebUtils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.LocaleResolver;

import java.util.Locale;

@RequiredArgsConstructor
@Component
public class LocalizationUtils {
    private final LocaleResolver localResolver;
    private final MessageSource messageSource;

    public String getLocalizedMessage(String messageKey, Object ... param) {
        HttpServletRequest request = WebUtils.getCurrentRequest();
        Locale locale = localResolver.resolveLocale(request);
        return messageSource.getMessage(messageKey, param, locale);
    }
}
