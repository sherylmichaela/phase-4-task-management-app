// import React, { useState } from "react";
// import Container from "react-bootstrap/esm/Container";
// import Form from "react-bootstrap/Form";
// import Modal from "react-bootstrap/Modal";
// import Row from "react-bootstrap/esm/Row";
// import Col from "react-bootstrap/esm/Col";

// export default function AddSubtaskButton(props) {
//   const [subtaskName, setSubtaskName] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (subtaskName.trim() === "") {
//       alert("Subtask name is required.");
//       return;
//     }

//     fetch("/tasks/${props.taskId}/subtasks", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         subtask_name: subtaskName,
//       }),
//     })
//       .then((response) => response.json())
//       .then((subtask) => {
//         props.onHide();
//       });
//   };

//   return (
//     <Modal
//       {...props}
//       size="lg"
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//     >
//       <Modal.Header closeButton>
//         <Modal.Title id="contained-modal-title-vcenter">
//           Create a subtask
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <Container>
//           <Form onSubmit={handleSubmit}>
//             <Row>
//               <Col xs={12}>
//                 <Form.Group className="mb-3" controlId="formTaskName">
//                   <Form.Label>What's your subtask?</Form.Label>
//                   <Form.Control
//                     type="text"
//                     value={subtaskName}
//                     onChange={(e) => setSubtaskName(e.target.value)}
//                     autoFocus
//                   />
//                 </Form.Group>
//               </Col>
//             </Row>

//             <Row className="mt-3">
//               <Col>
//                 <input
//                   type="submit"
//                   className="btn btn-primary btn-block"
//                   value="Add subtask"
//                 />
//               </Col>
//               <Col>
//                 <input
//                   type="button"
//                   className="btn btn-secondary btn-block"
//                   value="Close"
//                   onClick={props.onHide}
//                 />
//               </Col>
//             </Row>
//           </Form>
//         </Container>
//       </Modal.Body>
//     </Modal>
//   );
// }
