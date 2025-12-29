import React from 'react';
import Slider from '../src';

const LogoPlaceholder: React.FC<{ name: string; color: string }> = ({ name, color }) => (
  <div
    style={{
      width: 120,
      height: 60,
      backgroundColor: color,
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 14,
    }}
  >
    {name}
  </div>
);

const Section: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({
  title,
  description,
  children,
}) => (
  <section style={{ marginBottom: 48, padding: '0 24px' }}>
    <h2 style={{ marginBottom: 8, color: '#333' }}>{title}</h2>
    <p style={{ marginBottom: 16, color: '#666', fontSize: 14 }}>{description}</p>
    <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      {children}
    </div>
  </section>
);

export default function App() {
  const logos = [
    { name: 'React', color: '#61dafb' },
    { name: 'Vue', color: '#42b883' },
    { name: 'Angular', color: '#dd1b16' },
    { name: 'Svelte', color: '#ff3e00' },
    { name: 'Next.js', color: '#000' },
    { name: 'Nuxt', color: '#00dc82' },
  ];

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 0' }}>
      <header style={{ textAlign: 'center', marginBottom: 48, padding: '0 24px' }}>
        <h1 style={{ marginBottom: 8, color: '#222' }}>React Infinite Logo Slider</h1>
        <p style={{ color: '#666' }}>Examples showcasing different configurations</p>
      </header>

      <Section title="Basic Usage" description="Default slider with basic configuration">
        <Slider>
          {logos.map((logo) => (
            <Slider.Slide key={logo.name}>
              <LogoPlaceholder {...logo} />
            </Slider.Slide>
          ))}
        </Slider>
      </Section>

      <Section title="Scroll Right" description="Using toRight prop to change direction">
        <Slider toRight>
          {logos.map((logo) => (
            <Slider.Slide key={logo.name}>
              <LogoPlaceholder {...logo} />
            </Slider.Slide>
          ))}
        </Slider>
      </Section>

      <Section title="Pause on Hover" description="Animation pauses when mouse hovers over the slider">
        <Slider pauseOnHover duration={20}>
          {logos.map((logo) => (
            <Slider.Slide key={logo.name}>
              <LogoPlaceholder {...logo} />
            </Slider.Slide>
          ))}
        </Slider>
      </Section>

      <Section title="With Blur Borders" description="Gradient blur effect on the edges">
        <Slider blurBorders blurBorderColor="#fff">
          {logos.map((logo) => (
            <Slider.Slide key={logo.name}>
              <LogoPlaceholder {...logo} />
            </Slider.Slide>
          ))}
        </Slider>
      </Section>

      <Section title="Custom Width & Speed" description="Wider slides with slower animation">
        <Slider width="250px" duration={60}>
          {logos.map((logo) => (
            <Slider.Slide key={logo.name}>
              <LogoPlaceholder {...logo} />
            </Slider.Slide>
          ))}
        </Slider>
      </Section>

      <Section title="Fast Animation" description="Quick scrolling with shorter duration">
        <Slider duration={10}>
          {logos.map((logo) => (
            <Slider.Slide key={logo.name}>
              <LogoPlaceholder {...logo} />
            </Slider.Slide>
          ))}
        </Slider>
      </Section>

      <Section title="All Options Combined" description="Combining multiple props together">
        <Slider
          toRight
          pauseOnHover
          blurBorders
          blurBorderColor="#f5f5f5"
          width="180px"
          duration={25}
        >
          {logos.map((logo) => (
            <Slider.Slide key={logo.name}>
              <LogoPlaceholder {...logo} />
            </Slider.Slide>
          ))}
        </Slider>
      </Section>
    </div>
  );
}
