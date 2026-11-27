import { useAge } from '../hooks.js';
import ScrollArea from './ScrollArea.jsx';

function Skill({ name, level }) {
  return (
    <p className="skill">
      {name} <span className="skill__n">{level}/5</span>{' '}
      <span className="skill__bar" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <i key={n} className={n <= level ? '' : 'is-empty'} />
        ))}
      </span>
    </p>
  );
}

export default function AboutBody() {
  const age = useAge();
  return (
    <ScrollArea>
    <div className="about">
      <p className="about__name">
        LeftySH<span className="cursor" aria-hidden="true" />
      </p>
      <p className="about__age">{age} years.</p>
      <p className="about__place">Russia, Novosibirsk</p>

      <p className="about__p">I’ve been doing design for about 5 years_</p>
      <p className="about__p">
        I love experimenting, trying out new ideas, and bringing whatever comes to mind to life_
      </p>
      <p className="about__p">
        My main focus is UI/UX design; I also work with web and graphic design_
      </p>
      <p className="about__p">
        I have some experience in motion design, which helps to add variety to my projects_
      </p>

      <div className="about__skills">
        <Skill name="Figma" level={4} />
        <Skill name="HTML & CSS" level={3} />
      </div>
    </div>
    </ScrollArea>
  );
}
