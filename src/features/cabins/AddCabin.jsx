import { useState } from "react";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";
import CreateCabinForm from "./CreateCabinForm";

function AddCabin() {
  return (
    <Modal>
      <Modal.Open opens="add-cabin-form">
        <Button>Add new cabin</Button>
      </Modal.Open>
      <Modal.Window name="add-cabin-form">
        <CreateCabinForm />
      </Modal.Window>

      {/* We can have multiple windows within the modal */}
      {/* <Modal.Open opens="add-cabin-form">
        <Button>Add new cabin</Button>
      </Modal.Open>
      <Modal.Window name="add-cabin-form">
        <CreateCabinForm />
      </Modal.Window> */}
    </Modal>
  );
}

// function AddCabin() {
//   const [isOpenModal, setIsOpenModal] = useState(false);

//   return (
//     <div>
//       <Button onClick={() => setIsOpenModal((isOpenModal) => !isOpenModal)}>
//         Add new cabin
//       </Button>
//       {isOpenModal && (
//         <Modal onClose={() => setIsOpenModal(false)}>
//           <CreateCabinForm onCloseModal={() => setIsOpenModal(false)} />
//         </Modal>
//       )}
//     </div>
//   );
// }

export default AddCabin;
