import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Modal } from '@material-ui/core';

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: "30%",
        textAlign: "center",
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function DeleteUser(props) {
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [message, setMessage] = React.useState({ color: "green", text: "" });
    const [loading, setLoading] = React.useState(false);
    const confirmSubmit = function () {
        setLoading(true)
        setMessage({ color: "green", text: "" });
        fetch("/users/deactivate/" + props.currentUserId, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem("HUNToken"),
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then((response) => response.json())
            .then((responseJson) => {
                setLoading(false)
                if (responseJson.success) {
                    setMessage({ text: responseJson.message, color: "green" })
                } else {
                    setMessage({ text: responseJson.message, color: "red" })
                }
            })
    }

    const body = (
        <div style={modalStyle} className={classes.paper}>
            <div>Eliminar usuario</div>
            {
                loading ?
                    <div className="loader"></div> :
                    <div style={{ margin: "30px" }}>
                        <div> ¿Desea eliminar este usuario? </div>
                        {
                            (message.text === "" && message.color === "green") &&
                            < div >
                                <Button
                                    onClick={confirmSubmit}
                                >
                                    Aceptar
                                </Button>
                                <Button
                                    onClick={() => props.handleDeleteUserModalOpen(false)}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        }

                        <div style={{ color: message.color }}>{message.text}</div>
                    </div>
            }
        </div >
    );

    return (
        <Modal
            open={props.open}
            onClose={() => props.handleDeleteUserModalOpen(false)}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
        >
            {body}
        </Modal>
    );
}