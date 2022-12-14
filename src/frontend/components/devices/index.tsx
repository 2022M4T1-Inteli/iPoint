import React, { useState, useMemo, useEffect } from 'react'
import { DevicesContainer, EyeIcon, Trash, Edit, EditName, Form } from './style'
import {
    DataGrid,
    GridColDef,
    GridRowId,
    GridToolbarQuickFilter
} from '@mui/x-data-grid'
import Link from 'next/link'
import Modal from '../modal'
import Input from '../input'
import { LoginBtn } from '../button'
import { useForm } from 'react-hook-form'
import axios from '../../axios'
import { toast } from 'react-toastify'
import Spinner from '../spinner'
import { convertRoom } from 'utils/room'
import ConfirmModal from '../confirmModal'

interface Props {
    admin?: boolean
    devices: Device[]
}

const Devices: React.FC<Props> = ({ admin, devices: devicesFromProps }) => {
    const columns: GridColDef[] = [
        {
            field: 'deviceId',
            headerName: 'Identificador',
            flex: 0.2,
            headerAlign: 'left',
            align: 'left'
        },
        {
            field: 'name',
            headerName: 'Dispositivo',
            flex: 0.2,
            align: 'left',
            headerAlign: 'left',
            renderCell: props => <div>{props.value ? props.value : '-'}</div>
        },
        {
            field: 'locations',
            headerName: 'Última localização',
            flex: 0.2,
            align: 'left',
            headerAlign: 'left',
            renderCell: props => {
                let i = props.value.length
                while (i > 0) {
                    if (props.value[props.value.length - 1].room) {
                        return (
                            <div>
                                {convertRoom(
                                    props.value[props.value.length - 1].room
                                )}
                            </div>
                        )
                    }
                    i--
                }

                return <span>Nenhuma localização registrada</span>
            }
        },
        {
            field: 'actions',
            headerName: 'Ações',
            headerAlign: 'center',
            align: 'center',
            disableColumnMenu: true,
            sortable: false,
            flex: 0.1,

            renderCell: props => {
                return (
                    <>
                        <Link href={'/devices/' + props.id}>
                            <EyeIcon />
                        </Link>
                        {admin && (
                            <Trash onClick={() => openConfirmModal(props.id)} />
                        )}
                    </>
                )
            }
        }
    ]

    if (admin) {
        columns.unshift({
            field: 'edit',
            headerName: 'Editar',
            headerAlign: 'left',
            align: 'left',
            disableColumnMenu: true,
            sortable: false,
            flex: 0.1,

            renderCell: props => <Edit onClick={() => openModal(props.row)} />
        })
    }

    const [devices, setDevices] = useState(devicesFromProps)
    const [showModal, setShowModal] = useState(false)
    const [currentDevice, setCurrentDevice] = useState<Device | null>(null)
    const [loading, setLoading] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [deleteId, setDeleteId] = useState<GridRowId | null>(null)

    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            name: useMemo(() => {
                return currentDevice ? currentDevice.name : ''
            }, [currentDevice])
        }
    })

    const refreshDevices = async () => {
        try {
            const { data: newDevices } = await axios.get('/devices')
            setDevices(newDevices)
        } catch (err) {
            toast.error('Erro ao atualizar informações de dispositivos!')
        }
    }

    const openModal = (device: Device) => {
        setCurrentDevice(device)
        setShowModal(true)
    }

    const closeModal = () => {
        setShowModal(false)
        setCurrentDevice(null)
        reset()
    }

    const editName = async (data: any) => {
        if (currentDevice) {
            setLoading(true)
            try {
                await axios.patch('/device/' + currentDevice._id, {
                    name: data.name
                })
                toast.success('Dispositivo editado com sucesso!')
                await refreshDevices()
                closeModal()
                setLoading(false)
            } catch (err) {
                toast.error('Ocorreu um erro ao editar o dispositivo!')
                setLoading(false)
            }
        }
    }

    useEffect(() => {
        if (currentDevice) {
            reset({ name: currentDevice.name })
        }
    }, [currentDevice, reset])

    const openConfirmModal = (id: GridRowId) => {
        setDeleteId(id)
        setShowConfirmModal(true)
    }

    const closeConfirmModal = () => {
        setDeleteId(null)
        setShowConfirmModal(false)
    }

    const deleteDevice = async () => {
        try {
            if (deleteId) {
                setLoading(true)
                await axios.delete('/device/' + deleteId)
                toast.warning('Dispositivo excluído com sucesso!')
                setLoading(false)
                refreshDevices()
            }
        } catch (err: any) {
            toast.error(err.response.data.error)
            setLoading(false)
        }
        setShowConfirmModal(false)
    }

    return (
        <>
            <Modal
                show={showModal}
                closeModal={closeModal}
                title={'Mudar nome do dispositivo'}
            >
                {loading ? (
                    <Spinner />
                ) : (
                    <Form onSubmit={handleSubmit(editName)}>
                        <Input name="name" register={register} label={'Nome'} />
                        <LoginBtn type="submit">Editar</LoginBtn>
                    </Form>
                )}
            </Modal>
            <ConfirmModal
                show={showConfirmModal}
                confirmHandler={deleteDevice}
                title="Tem certeza que deseja deletar esse dispositivo e todas as suas localizações?"
                loading={loading}
                closeModal={closeConfirmModal}
            />
            <DevicesContainer>
                <DataGrid
                    rows={devices}
                    getRowId={row => row._id}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick
                    components={{ Toolbar: GridToolbarQuickFilter }}
                    componentsProps={{
                        toolbar: {
                            showQuickFilter: true,
                            quickFilterProps: { debounceMs: 500 }
                        }
                    }}
                />
            </DevicesContainer>
        </>
    )
}

export default Devices
