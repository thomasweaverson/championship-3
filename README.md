## Чемпионат по вёрстке #3

#### Организаторы Чемпионата [html Academy](https://htmlacademy.ru)
#### Макет предоставлен компанией [Mish](https://mish.design/ru)
#### Участник Артем Ткачев

## Установка и запуск

**node 22.x**
**npm >=9.0.0**

#### Установка зависимостей
```npm ci```

#### Сборка продакшн-версии
```npm run build```

#### Запуск сборки
```npm run preview```

#### Запуск в режиме разработки
```npm start```

### Линтинг
```npm run lint```

> html-validate проверяет html-файлы из папки dist.
> Поэтому лучше запускать линтинг после сборки `npm run build`


## Дальше скучно

### Памятка, как пользоваться сборка

#### Запуск в режиме разработки
```npm start```
запускает создание оптимизированных изображений и только потом запускает dev Режим
Если изображения уже создавались - быстрее запускать сразу npm run dev


### Спрайт
Сохранять файлы в `/src/assets/sprite`

#### Использование в html:
```
<svg class="logo__image" width="127" height="28" viewBox="0 0 127 28" fill="none"
  xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <use href="/sprite.svg#logo"></use>
</svg>
```

### Картинки в формате jpg, png, svg

Сохранять в форматах jpg, png, svg в `/src/assets/images/raw`

В режиме dev все файлы из /src/assets/images/raw будут оптимизированы и скопированы в папку `/public/assets/images`

Также у растровых изображений будут созданы версии - avif и webp

#### Пример использования в html:

```
<picture>
  <source media="(min-width: 960px)" type="image/avif"
    srcset="/assets/images/hero-big-01@1x.avif 1x, /assets/images/hero-big-01@2x.avif 2x">
  <source type="image/avif"
    srcset="/assets/images/hero-01@1x.avif 1x, /assets/images/hero-01@2x.avif 2x">

  <source media="(min-width: 960px)" type="image/webp"
    srcset="/assets/images/hero-big-01@1x.webp 1x, /assets/images/hero-big-01@2x.webp 2x">

  <source type="image/webp"
    srcset="/assets/images/hero-01@1x.webp 1x, /assets/images/hero-01@2x.webp 2x">

  <source media="(min-width: 960px)"
    srcset="/assets/images/hero-big-01@1x.jpg 1x, /assets/images/hero-big-01@2x.jpg 2x">

  <img class="hero__tutor-photo" src="/assets/images/hero-01@1x.jpg"
    srcset="/assets/images/hero-01@2x.jpg 2x" width="221" height="135" alt="Фото наставника Артура">
</picture>
```

#### Пример использования в css:

```
 &--accent {
    background-color: variables.$color-accent;
    background-image:
      image-set(
        url("/assets/images/advantage-tutor-background@1x.avif") 1x type("image/avif"),
        url("/assets/images/advantage-tutor-background@2x.avif") 2x type("image/avif"),
        url("/assets/images/advantage-tutor-background@1x.webp") 1x type("image/webp"),
        url("/assets/images/advantage-tutor-background@2x.webp") 2x type("image/webp"),
        url("/assets/images/advantage-tutor-background@1x.png") 1x type("image/png"),
        url("/assets/images/advantage-tutor-background@2x.png") 2x type("image/png")
      );
    background-repeat: no-repeat;
    background-position: bottom right;

    @include media.desktop {
      background-image:
        image-set(
          url("/assets/images/advantage-tutor-background-big@1x.avif") 1x type("image/avif"),
          url("/assets/images/advantage-tutor-background-big@2x.avif") 2x type("image/avif"),
          url("/assets/images/advantage-tutor-background-big@1x.webp") 1x type("image/webp"),
          url("/assets/images/advantage-tutor-background-big@2x.webp") 2x type("image/webp"),
          url("/assets/images/advantage-tutor-background-big@1x.png") 1x type("image/png"),
          url("/assets/images/advantage-tutor-background-big@2x.png") 2x type("image/png")
        );
    }
  }
```
