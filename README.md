# React Async Modal

This repository contains a custom React hook (useAsyncModal) and a modal context provider (AsyncModalProvider) for handling asynchronous modal dialogs in your React application.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Advanced Usage](#advanced-usage)
- [Example With MUI Library](#example-with-mui-library)

## Features

- Async Modals: The showModal method returns a Promise that resolves when the modal is closed.
- Dynamic Data Passing: You can pass dynamic data to the modal and handle it in your component.
- Dismissible Modals: You can make modals dismissible or non-dismissible.
- Fully Typed: Typescript support is included to ensure type safety for modal props and returned values.

## Installation

To install, you can use npm or yarn or pnpm:

```js
npm install @paratco/async-modal

yarn add @paratco/async-modal

pnpm add @paratco/async-modal
```

## Usage

1. Set up the `AsyncModalProvider`

   Wrap your application (or a part of it where you need modal functionality) with the `AsyncModalProvider`:

   ```tsx
   import { AsyncModalProvider } from "@paratco/async-modal";

   function App() {
     return <AsyncModalProvider>{/* Rest of your app */}</AsyncModalProvider>;
   }
   ```

2. Create a Modal Component

   Create a modal component that conforms to the `AsyncModalProps` interface:

   - The modal may or may not include `data` props.

     Example with `data`

     ```tsx
     import { AsyncModalProps, AsyncModalPropsBase } from "@paratco/async-modal";

     interface Data extends AsyncModalPropsBase {
       message: string;
     }

     export default function MyModal({ onClose, dismissible, data }): AsyncModalProps<boolean, Data> {
       // You can destructure data or not
       const { message } = data;

       function handleClose() {
         if (dismissible) {
           onClose();
         }
       }

       function handleConfirm(){
        console.log("Confirm");

        onClose(true);
       }

       return (
         <div className="modal">
           <!-- if don`t destructure data use like this: <p>{data?.message}</p> -->
           <p>{message}</p>
           <button onClick={() => handleConfirm()}>Confirm</button>
           <button onClick={() => handleClose()}>Cancel</button>
         </div>
       );
     }

     export default MyModal;
     ```

     - `AsyncModalProps<boolean, Data>` is a return type

     Example without `data`

     ```tsx
     import { AsyncModalProps } from "@paratco/async-modal";

     export default function MyModal({ onClose, dismissible }): AsyncModalProps<boolean> {
       function handleClose() {
         if (dismissible) {
           onClose();
         }
       }

       return (
         <div className="modal">
           <p>Are you sure?</p>
           <button onClick={() => console.log("Confirm")}>Confirm</button>
           <button onClick={() => handleClose()}>Cancel</button>
         </div>
       );
     }

     export default MyModal;
     ```

3. Use the `useAsyncModal` Hook

   In any component where you need to show a modal, use the `useAsyncModal` hook to access the `showModal` method:

   Example with `data`

   ```tsx
   import { useAsyncModal } from "@paratco/async-modal";
   import MyModal from './components/MyModal';

   export default ExampleComponent () {
     const { showModal } = useAsyncModal();

     const handleShowModal = async () => {
       const result = await showModal({
         modal: MyModal,
         data: { message: "Are you sure you want to proceed?" },
         dismissible: true
       });

       if (result) {
         console.log("User confirmed");
       } else {
         console.log("User canceled");
       }
     };

     return (
       <div>
         <button onClick={handleShowModal}>Open Modal</button>
       </div>
     );
   };
   ```

   Example without `data`

   ```tsx
    import { useAsyncModal } from "@paratco/async-modal";
    import MyModal from './components/MyModal';

    export default ExampleComponent () {
     const { showModal } = useAsyncModal();

     const handleShowModal = async () => {
       const result = await showModal({
         modal: MyModal,
         dismissible: true
       });

       if (result) {
         console.log("User confirmed");
       } else {
         console.log("User canceled");
       }
     };

     return (
       <div>
         <button onClick={handleShowModal}>Open Modal</button>
       </div>
     );
   };
   ```

4. Modal Context Configuration

- `showModal(params)`: Displays the modal. The params object should include:
  - `modal`: The component to render as the modal.
  - `data`: Optional. Any data to pass into the modal.just define types.
  - `dismissible`: Optional. If set to `false`, the modal cannot be dismissed without user action.
- Modal Component: The modal component receives the following props:
  - `onClose(result)`: Call this function to close the modal and resolve the promise with a result.
  - `data`: Optional. Any data passed from the `showModal` call.

## Advanced Usage

### Handling Multiple Modals

The AsyncModalProvider can handle multiple modals across different components. Each modal will wait for the previous one to resolve before being displayed.

### Custom Dismiss Behavior

You can make modals undismissible by setting dismissible to false. This prevents the modal from closing unless the user interacts with it.

```tsx
const result = await showModal({
  modal: MyModal,
  data: { message: "You must confirm this action" },
  dismissible: false // Modal cannot be dismissed without action
});
```

### Passing Complex Data

You can pass any type of data to your modal. This can be useful for passing context, form data, or other inputs that need to be shown or processed inside the modal.

```tsx
const result = await showModal({
  modal: UserConfirmationModal,
  data: { userId: 42, username: "JohnDoe" }
});
```

## Example With MUI Library

MyModal Component:

```tsx
import { faXmark } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Box, Stack, Typography, IconButton, Divider } from "@mui/material";
import type { ReactElement } from "react";
import { AsyncModalProps, AsyncModalPropsBase } from "@paratco/async-modal";

interface Data extends AsyncModalPropsBase {
  readonly ban: string | null;
}

export default function MyModal({ onClose, dismissible, data }: AsyncModalProps<boolean, Data>): ReactElement {
  function handleClose(): void {
    if (dismissible) {
      onClose();
    }
  }

  return (
    <Modal
      open={true}
      onClose={() => {
        handleClose();
      }}
    >
      <Box>
        <Stack direction="row" justifyContent="space-between" pb={2}>
          <Typography component="h2">Reason:</Typography>

          <Stack alignItems="end">
            <IconButton
              size="small"
              onClick={() => {
                handleClose();
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </Stack>
        </Stack>

        <Divider />

        <Typography sx={{ mt: 2 }}>{data?.ban}</Typography>
      </Box>
    </Modal>
  );
}
```

BaseComponent:

```tsx
  import { useAsyncModal } from "@paratco/async-modal";
  import MyModal from './components/MyModal';

  export default ExampleComponent () {
    const { showModal } = useAsyncModal();

   const handleOpenReasonModal = (): void => {
    void showModal({ modal: MyModal, dismissible: true, data: { ban } });
  };

    return (
     <Stack alignItems="center" direction="row" gap={1}>
        <FontAwesomeIcon icon={faCommentExclamation} />
        <Typography component={Button} p={0} variant="body2" fontWeight="bold" onClick={handleOpenReasonModal}>
          {t("students.whyBan")}
        </Typography>
      </Stack>
    );
  };
```
