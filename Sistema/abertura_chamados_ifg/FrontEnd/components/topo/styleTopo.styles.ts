import styled from "styled-components";

const Component = styled.div`
width: 75%;
height: 70px;
background-color: #fff;
display: flex;
color:#4F4F4F;
margin-top: 25px;
margin-left: 10%;
border-radius: 5px;

.container{
    display: flex;
    flex-direction: row;
    margin-top: 20px;
    margin-left: 5%;
}
i{
    font-size: 25px;
}

h3{
    margin-left: 25px;
    margin-top: 4px;
}


@media ( max-width: 462px) {
    h3{
        font-size: 20px;
        margin-top:6px;
        margin-left: 22px;
    }
}

`
export default Component;