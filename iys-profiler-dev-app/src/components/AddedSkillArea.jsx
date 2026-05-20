import Badge from 'react-bootstrap/Badge';
import SkillsAdded from './SkillsAdded';



const AddedSkillArea = () => {
    return (
        <span className='pt-3'>
        <Badge bg="light" text='dark'>
        3
      </Badge>< span className="text-muted" >Skills Added to your Profile</span>
        <div className='mt-3'>
          <SkillsAdded  name="My Component" />
          </div>
        <hr />
        </span>
    );
}

export default AddedSkillArea;