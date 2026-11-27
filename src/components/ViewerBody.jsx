export default function ViewerBody({ project }) {
  return <img className="viewer__img" src={project.cover} alt={`${project.file} — project cover`} draggable="false" />;
}
