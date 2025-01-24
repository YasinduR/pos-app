import React from "react";
import BackButton from "../BackButton/Back_Button";

const Header = ({headtext}) => {

return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
    <h1>{headtext}</h1>
    <BackButton/>
    </div>
    );

}

export default Header;