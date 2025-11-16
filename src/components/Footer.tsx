'use client';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import Container from './container/Container';
import MyLink from './Link';
import Logo from './Logo';

export default function Footer() {
  const navigationTranslation = useTranslations('Header');
  const t = useTranslations('Footer');
  return (
    <Container>
      <footer className="mx-auto mt-10 flex flex-col gap-16 pb-14 text-[16px] text-cyan-50">
        <section className="grid grid-cols-1 gap-16 md:grid-cols-3 ">
          {' '}
          <div>
            <Logo classNames="mb-6" size={60} />
            {' '}
            <p className="text-center">{t('description')}</p>
          </div>
          <div>
            <p className="mb-4 text-center text-2xl">{t('contacts')}</p>
            {' '}
            <div className="flex items-center justify-center gap-3.5">
              <Icon icon="material-symbols:mail" />
              {' '}
              <a
                href="mailto:office@alexfisherway.com"
                className="transition-opacity duration-400 hover:opacity-50"
              >
                office@alexfisherway.com
              </a>
            </div>
          </div>
          <div className="w-fit place-self-center md:self-start">
            <p className="mb-4 text-2xl">{t('navigation')}</p>
            {' '}
            <ul className="flex flex-col gap-3 md:self-start">
              <li>
                <MyLink addHoverOpacity href="/">
                  {navigationTranslation('home_link')}
                </MyLink>
              </li>
              <li>
                <MyLink addHoverOpacity href="/products">
                  {navigationTranslation('products_link')}
                </MyLink>
              </li>

              <li>
                <MyLink addHoverOpacity href="/reviews">
                  {navigationTranslation('reviews_link')}
                </MyLink>
              </li>

              <li>
                <MyLink addHoverOpacity href="/stories">
                  {navigationTranslation('stories_link')}
                </MyLink>
              </li>
              <li>
                <MyLink addHoverOpacity href="/cart">
                  {navigationTranslation('cart_link')}
                </MyLink>
              </li>
            </ul>
          </div>
        </section>
        <section className="flex flex-col items-center justify-center gap-2">
          <p className="max-w-4xl text-center">{t('small_description')}</p>
          <MyLink addHoverOpacity href="/policy">
            {t('policy')}
          </MyLink>
          <p>
            {t('copyright')}
            {' '}
            {new Date().getFullYear()}
            .
            {' '}
            <a
              className="transition-opacity duration-400 hover:opacity-50"
              href="mailto:vladprangati@gmail.com"
            >
              Made by Vlad Prangati
            </a>
          </p>
        </section>
      </footer>
    </Container>
  );
}
