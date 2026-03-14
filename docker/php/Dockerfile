FROM php:8.3-fpm

# Dépendances système
RUN apt-get update && apt-get install -y \
    libicu-dev \
    libzip-dev \
    libssl-dev \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Extensions PHP
RUN docker-php-ext-install \
    intl \
    zip \
    opcache

# Extension MongoDB via PECL
RUN pecl install mongodb && docker-php-ext-enable mongodb

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Dossier pour les images téléchargées depuis Trefle.io
RUN mkdir -p public/images/plantes && chown www-data:www-data public/images/plantes
