import Popover from 'react-bootstrap/Popover';



const DetailSkillPopup = (props) => {
    const buttonStyle1 = {
        backgroundColor: "#0d6efd29"
    };
    const renderSkillDescription = (skillDetail) => {

        if (skillDetail?.files?.length) {
            return skillDetail?.files[0]?.description
        } else if (skillDetail?.file) {
            return skillDetail?.file?.description
        }
        else {
            return skillDetail?.skill?.description;
        }
    }

    return (

        <Popover id="popover-basic">
            <Popover.Header as="h3" style={buttonStyle1}>{props.name}</Popover.Header>
            <Popover.Body>{renderSkillDescription(props)}</Popover.Body>
        </Popover>
    )
};
export default DetailSkillPopup;
