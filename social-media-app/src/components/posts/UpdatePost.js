import { useState } from 'react'
import { Button, Modal, Form, Dropdown } from 'react-bootstrap'
import axiosService from '../../helpers/axiosHelper'
import { getUser } from '../../hooks/user.actions'
import Toaster from '../Toaster'

function UpdatePost({ post, refresh }) {
    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastType, setToastType] = useState('')
    const [validated, setValidated] = useState(false)
    const [form, setForm] = useState({
        author: post.author.id,
        body: post.body,
    })
    const user = getUser()

    const handleSubmit = (event) => {
        event.preventDefault()

        const createPostForm = event.currentTarget

        if (createPostForm.checkValidity() === false) {
            event.stopPropagation()
        }

        setValidated(true)

        const data = {
            author: user.id,
            body: form.body,
        }

        axiosService
            .put(`/post/${post.id}/`, data)
            .then(() => {
                handleClose()
                setToastMessage('Post updated')
                setToastType('success')
                setShowToast(true)
                refresh()
            })
            .catch(() => {
                setToastMessage('An error occurred')
                setToastType('danger')
            })
    }

    return (
        <>
            <Dropdown.Item onClick={handleShow} data-testid='show-modal-form'>
                Modify
            </Dropdown.Item>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton className='border-0'>
                    <Modal.Title>Update Post</Modal.Title>
                </Modal.Header>
                <Modal.Body className='border-0'>
                    <Form
                        noValidate
                        validated={validated}
                        onSubmit={handleSubmit}
                        data-testid='update-post-form'
                    >
                        <Form.Group className='mb-3'>
                            <Form.Control
                                name='body'
                                value={form.body}
                                onChange={(e) =>
                                    setForm({ ...form, body: e.target.value })
                                }
                                as='textarea'
                                rows={3}
                                data-testid='post-body-field'
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant='primary'
                        onClick={handleSubmit}
                        disabled={form.body === undefined}
                        data-testid='update-post-submit'
                    >
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
            <Toaster
                title='Post!'
                message={toastMessage}
                showToast={showToast}
                type={toastType}
                onClose={() => setShowToast(false)}
            />
        </>
    )
}

export default UpdatePost
