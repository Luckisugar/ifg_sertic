// import styled from "styled-components";

// const Component = styled.div`
// width: 75%;
// min-height: 850px;
// height: 850px auto;
// background-color: #fff;
// display: flex;
// color:#000;
// margin-top: 25px;
// margin-left: 10%;
// border-radius: 5px;
// display: flex;
// flex-direction: column;


// .box{
//     width: 100%;
//     height: 55px;
//     display: flex;
//     flex-direction: column;
//     background-color: #2F9E41;
//     border-radius: 7px;
//     margin-top: 25px;
// }
// .title-box{
//     color: #fff;
//     display: flex;
// }
// .box-info{
//     width: 100%;
//     border-radius: 7px 7px 0px 0px;
// }
// .content-sub p{
//     margin-bottom: 7px;
//     display: flex;
// }
// .title-sub{
//     text-transform: uppercase;
//     font-weight: bold;
    
//     cursor: pointer;
// }
// .text-sub{
//     left: 0;
//     position: relative;
//     color: #4F4F4F;
// }
// .box-container{
//     width: 100%;
//     min-height: 830px;
//     height:  auto;
//     margin-top: 15px;
//     border-radius: 7px 7px 0px 0px;
//     border: 1px solid #000;
// }
// .box-container h3{
//     margin-top: 15px;
//     margin-left: 15px;
// }
// .text-title{
//     display: flex;
//     flex-direction:row;
//     position: absolute;
//     padding-left: 175px;
//     color: #4F4F4F;
//     padding-top: 20px;
//     font-weight: normal;
// }
// .content-sub{
//     display: flex;
//     flex-direction: column;
//     position: relative;
//     margin-top: 20px; 
//     margin-left: 15px;
// }

// .content-sub h3{
//     margin-left: 0px;
// }

// i{
//     display: flex;
//     flex-direction: column;
//     margin-left: auto; 
//     text-align: right; 
//     margin-right: 18px;
// }
// .container{
//     display: flex;
//     flex-direction: column;
//     flex-wrap: wrap;
//     position: relative;
//     margin-top: 100px;
//     margin-left: 250px;
//     right: 50px;
// }
// p{
//     text-transform: capitalize;
// }
//  .container input, select {
//     width: 370px;
//     height: 40px;
//     margin-top: 5px;
//     padding-left: 10px;
//     border-radius: 5px;
//     margin-bottom: 35px;
//     background-color: #fff;
//     border: 1px solid #D9D9D9;
//     display: flex;
    
// }

// .view-sub{
//     /* border-top:2px solid red ; */
//     margin-top: 25px;
// }
// .line{
//     width: 98%;
//     margin-top: 20px;
//     border-top: 2px solid #efefef;
// }
// .container textarea{
//     width: 350px;
//     height: 80px;
//     margin-top: 5px;
//     margin-bottom: 35px;
// }

// .inputFields{
//     display: flex;
//     flex-direction: column;
//     position: absolute;
//     right: 40%; 
// }
//  .button-cancel,.button-register, .button-register-sub,.button-save-sub{
//     width: 200px;
//     height: 35px;
//     display: flex;
//     justify-content: center;
//     flex-direction: column;
//     color: #fff;
//     border-radius: 5px;
//     border: none;
//     cursor: pointer;
//     margin-bottom: 15px;
//     font-weight: bold;
// }
// .button-cancel{
//     color: #E93033;
//     border: 1px solid #E93033;
//     background-color: #fff;
//     margin-left: 720px;
// }

// .button-cancel:hover{
//     background-color: #E93033;
//     color: #fff;
// }
// .button-register{
//  background-color: #2F9E41;
//  margin-top: 90px;
// }
// .button-delete{
//   width: 40px;
//   background-color: transparent;
//   border: none;
//   color: #E93033;
//   cursor: pointer;
//   align-self: flex-end; 
// }

// .button-register-sub{
//     background-color: #2F9E41;
//     margin-top: 50px;
//     margin-left: 720px;
// }

// .button-save{
//     color: red;
//     background-color: #2F9E41;
//     margin-left: 720px;
// }
// .p-description{
//     width: 520px;
// }
// .input-file {
//   border: 1px solid #e5e5e5;
// }

// input[type=file]::file-selector-button {
//   background-color: #fff;
//   color: #000;
//   border: 0px;
//   border-right: 1px solid #e5e5e5;
//   padding: 10px 15px;
//   margin-right: 20px;
//   transition: .5s;
// }
// span{
//     color: red;
// }

// .add-sub{
//     width: 230px;
//     height: 40px;
//     margin-top: 10px;
//     font-size: 15px;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     background-color: transparent;
//     border-radius: 5px;
//     border: 1px solid #83BF02;
//     cursor: pointer;
//     gap: 10px;
//     color: #83BF02;
// }
// .add-sub:hover{
//     background-color: #83BF02;
//     color: #fff;
// }
// .container-sub{
//     display: flex;
//     flex-direction: column;
//     position: absolute;
//     right: 30%;
// }
// textarea{
//     padding-left: 5px;
//     padding-top: 5px;
// }

// @media (max-width: 2100px) {
//     .button-register{
//         margin-left: 400px;
//     }
//     .container{
//     margin-left: 200px;
//     }
//     .container-sub{
//     right: 12%;
//     }
//     .button-save, .button-cancel{
//     margin-left: 620px;
//     }
//     .text-title{
//         padding-left: 125px;
//     }
// }

// @media (max-width:1900px){
//     .button-register-sub,.button-save-sub{
//         margin-left: 590px;
//     }
// }
// @media (max-width: 1670px) {
//     .button-register{
//         margin-left: 350px;
//     }
//     .button-save, .button-cancel{
//     margin-left: 500px;
//     }
//     .button-register-sub,.button-save-sub{
//         margin-left: 540px;
//     }
// }

// @media (max-width: 1430px) {
//     .container input, select, textarea {
//     width: 300px;
//     }
//     .container textarea{
//         width: 300px;
//     }
//     .button-register{
//         margin-left: 270px;
//     }
//     .button-save, .button-cancel{
//     margin-left: 330px;
//     }
//     .button-register-sub,.button-save-sub{
//         margin-left: 330px;
//     }
// }

// @media (max-width: 1258px) {
//     .container input, select, textarea {
//     width: 280px;
//     }
//     .container textarea{
//         width: 280px;
//     }
//     .button-register{
//         margin-left: 220px;
//     }
//     .button-save, .button-cancel{
//         margin-left: 300px;
//     }
//     .button-register-sub,.button-save-sub{
//         margin-left: 380px;
//     }
// }

// @media (max-width: 1164px) {
//     .container{
//     margin-left:150px;
//     }
//     .button-register{
//         margin-left: 180px;
//     }
//     .add-sub{
//     width: 200px;
// }
//     .button-save, .button-cancel{
//         margin-left: 350px;
//     }
//     .text-title{
//         padding-left: 90px;
//     }
//     .button-register-sub,.button-save-sub{
//         margin-left: 340px;
//     }

// }

// @media (max-width: 1072px) {
//     .container{
//     margin-left: 100px;
//     }
//     .container input, select, textarea {
//     width: 250px;
//     }
//     .container textarea{
//         width: 250px;
//     }
//     .button-register{
//         margin-left: 200px;
//     }
//     .add-sub{
//     width: 170px;
//     font-size: 12px;
//     }
//     .button-save, .button-cancel{
//         margin-left: 320px;
//     }
//     .text-title{
//         padding-left: 40px;
//     }
//     .button-register-sub,.button-save-sub{
//         margin-left: 280px;
//     }
// }

// @media (max-width: 963px) {
//     .container{
//     margin-left: 80px;

//     }
//     .container input, select, textarea {
//     width: 230px;
//     }
//     .container textarea{
//         width: 230px;
//     }
//     .button-register{
//         margin-left: 200px;
//     }
//     .add-sub{
//     width: 170px;
//     font-size: 12px;
//     }
//     .button-save, .button-cancel{
//         margin-left: 260px;
//     }
//     .text-title{
//         padding-left: 10px;
//     }
//     .button-register-sub,.button-save-sub{
//         margin-left: 230px;
//     }
// }

// @media (max-width: 807px) {
//     .container{
//     margin-left: 70px;
//     /* flex-direction: column; */
//     }
//     .container-sub{
//     right: 0;
//     }
//     .container input, select, textarea {
//     width: 230px;
//     }
//     .container textarea{
//         width: 230px;
//     }
//     .button-register{
//         margin-left: 200px;
//     }
//     .add-sub{
//     width: 170px;
//     font-size: 12px;
//     }
//     .button-save, .button-cancel{
//         margin-left: 210px;
//     }
//     .button-register-sub,.button-save-sub{
//         margin-left: 200px;
//     }
// }


// @media (max-width: 723px) {
    
//     .container-sub{
//     position: relative;
//     right: 0px;
//     }
//     .container input, select, textarea {
//     width: 300px;
//     }
//     .container textarea{
//         width: 300px;
//     }
//     .button-register{
//         margin-left: 130px;
//     }
//     .add-sub{
//     width: 170px;
//     font-size: 12px;
//     }
//     .button-save, .button-cancel{
//         margin-left: 140px;
//     }
//     .button-register-sub,.button-save-sub{
//         margin-left: 130px;
//     }
// }
// @media (max-width: 561px) {
//     .button-register{
//         margin-left: 90px;
//     }
//     .button-save, .button-cancel{
//         margin-left: 100px;
//     }
//     .button-register-sub,.button-save-sub{
//         margin-left: 90px;
//     }
// }

// @media (max-width: 461px) {

//     .container input, select, textarea {
//     width: 270px;
//     }
//     .container textarea{
//         width: 270px;
//     }
//     .button-register{
//         margin-left: 40px;
//     }
//     .button-save, .button-cancel{
//         margin-left: 70px;
//     }
//     .button-register-sub,.button-save-sub{
//         margin-left: 50px;
//     }
// }
// @media (max-width: 393px) {

// .container input, select, textarea {
// width: 250px;
// }
// .container textarea{
//     width: 250px;
// }
// .button-register{
//     margin-left: 20px;
// }
// .button-save, .button-cancel{
//         margin-left: 50px;
//     }
// .button-register-sub,.button-save-sub{
//  margin-left: 20px;
// }
// }



// `
// export default Component;