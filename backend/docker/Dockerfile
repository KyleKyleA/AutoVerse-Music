FROM php:8.2-apache

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

RUN apt-get update \
    && apt-get install -y unzip git zip libpq-dev curl \
    && docker-php-ext-install pdo pdo_pgsql \
    && rm -rf /var/lib/apt/lists/*

# Install PHPUnit
RUN curl -L -o /usr/local/bin/phpunit https://phar.phpunit.de/phpunit-10.phar \
    && chmod +x /usr/local/bin/phpunit

# IMPORTANT: this path is relative to build context (docker/)
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

WORKDIR /var/www/html