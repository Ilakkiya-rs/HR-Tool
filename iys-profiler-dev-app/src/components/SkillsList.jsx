import Skills from "./subcomponents/Skills";

const SkillsList = (props) => {
  return (
    <>
      <div className="mt-3">
        {props.searchSkillList.map((category) => (
          <Skills key={category._id} skillDetail={category} />
        ))}
      </div>
    </>
  );
}

export default SkillsList;
