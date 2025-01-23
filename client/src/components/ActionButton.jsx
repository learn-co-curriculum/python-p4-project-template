import Button from 'react-bootstrap/Button';

const ActionButton = ({variant, title, onClick=null, href=null}) => {
    return (
        <Button href={href} onClick={onClick} variant={variant}>{title}</Button>
    );
}

export default ActionButton;
