import styled from "styled-components";

const Component = styled.div`
top: 0;
bottom: 0;
right: 0;
left: 0;
display: flex;
justify-content: center;
align-items: center;
background-color: rgba(0,0,0,0.6);
position: fixed;
z-index: 99;
width: 100%;
height: 100%;

.wrapper {
display: flex;
gap: 20px; 
}

.container {
    width: 950px;
    max-width: 90vw;
    height: 850px;
    max-height: 90vh;
    background-color: #fff;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    position: relative;
    gap: 5px;
    padding: 20px;
    padding-bottom: 5rem;
}

.slider-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 300px;
    overflow: hidden;
    flex-grow: 1;
}

.text-container{
    overflow: auto;
    flex-grow: 1;
}

.text-description{
    max-width: 550px;
}
.container-edit {
    /* flex: 1;  */
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 160px;
    margin-top: 80px;
}

.btn-close{
    width: 50px;
    display: flex;
    justify-content: center;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    background-color: #DA373A;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px;
}
.btn-edit, .btn-delete, .btn-save, .btn-cancel{
    cursor: pointer;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px;
    width: 100px;

}
.buttons {
  bottom: 0;
  position: absolute;
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  gap: 1rem;
  justify-content: flex-start;

}
.btn-edit, .btn-save{
    background-color: #2F9E41;
}
.btn-delete, .btn-cancel{
    background-color: #DA373A;
}
i{
    margin-right: 5px;
}
h2{
    text-align: center;
    margin-top: 20px;
    margin-bottom: 25px;
}

.swiper {
    width: 150px;
    height: 230px;
}

.swiper-wrapper{
    display: flex;
    flex-direction: row;
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 1;
    transition-property: transform;
    transition-timing-function: var(--swiper-wrapper-transition-timing-function, initial);
    box-sizing: content-box;
}

.next, .prev {
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 30px;
    border: none;
    background-color: transparent;
    color: #B1B1B1;
    cursor: pointer;
    z-index: 10;
}
      
.input {
  width:250px;
  height: 40px;
  padding: 12px;
  border-radius: 5px;
  margin-top: 5px;
  background-color: #fff;
  border: 1px solid #D9D9D9;
  margin-bottom: 12px;
}

.select {
  width:250px;
  height: 40px;
  padding: 2px;
  border-radius: 5px;
  margin-top: 5px;
  margin-bottom: 12px;
  border: 1px solid #D9D9D9;
  background-color: #fff;
}
.input-disabled{
  width:250px;
  height: 40px;
  padding: 12px;
  border-radius: 5px;
  margin-top: 5px;
  background-color: #FFF;
  border: 1px solid #D9D9D9;
 margin-bottom: 12px;
}
.texteare-disabled{
  width:350px;
  min-height: 150px;
  padding: 2px;
  border-radius: 5px;
  
  background-color: #FFF;
  border: 1px solid #D9D9D9;

}

.td-subject{
    max-width: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.text-container {
  padding: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  margin-bottom: 2rem;
}

.info-col h3 {
  margin-top: 1rem;
  margin-bottom: 0.25rem;
}

.slider-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.table-subchamados {
  margin-top: 1rem;
}


.MuiTableHead-root .MuiTableCell-root{
  font-weight: bold;
}

textarea {
  max-width: 400px;
  height: 100px; 
  max-height: 100px; 
  resize: vertical; 
  overflow-y: auto; 
  box-sizing: border-box; 
  margin-bottom: 10px;
  padding-left: 5px;
}

@media (max-width: 930px) {
  .container-edit {
    flex-direction: column;
    position: relative;
    right: 0;
    margin-top: 0;
  }
    .container{
    overflow-y: auto;
  }
  .buttons{
    position: relative;
  }
 textarea {
  max-width: 250px;
}
        
}

`;

export default Component;
