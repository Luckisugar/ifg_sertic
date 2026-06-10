import React from 'react';
import * as S from './styleConfirmModal.style';

type ConfirmModalProps = {
    message?: string;
    onConfirm: (e:any) => void;
    onCancel: () => void;
    editedItem?: () => void;
    item?: any;
    setEditedItem?: (item: any) => void;
    
    shouldReturn: boolean;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({ message, onConfirm, onCancel, shouldReturn, setEditedItem}) => {
    return (
        <S.Overlay>
            <S.Container>
            <form  onSubmit={(e) => { e.preventDefault(); onConfirm(e); }}>
            {shouldReturn &&(
                <div>
                 <h4>Justificativa</h4>
                 <S.TextArea placeholder='Digite uma justificativa' 
                  onChange={(e) => {
                    setEditedItem((prev: any) => ({
                      ...prev,
                      justificativaDevolucao: e.target.value,
                    }))
                  }}
                  required></S.TextArea>
                 </div>
            )}
                <S.Message>{message}</S.Message>
                <S.Buttons>
                    
                    <S.CancelButton onClick={onCancel}>Cancelar</S.CancelButton>
                    <S.ConfirmButton type='submit'>Confirmar</S.ConfirmButton>
                    
                </S.Buttons>
            </form>
            </S.Container>
        </S.Overlay>
    );
};

export default ConfirmModal;