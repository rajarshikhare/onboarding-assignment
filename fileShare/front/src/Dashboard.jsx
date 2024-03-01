import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Switch,
  useDisclosure,
} from "@nextui-org/react";
import { BsUpload } from "react-icons/bs";
import Upload from "./Upload";
import { useEffect, useState } from "react";
import { deleteUploads, downloadUploads, getUploads, makePrivate, makePublic } from "./ApiService";

export default function Dashboard() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [files, setFiles] = useState([])

  useEffect(() => {
    getFiles()
  }, [])

  const getFiles = () => {
    getUploads().then(r => {
      setFiles(r.data)
    })
  }

  const onCloseDialog = () => {
    onClose();
    getFiles();
  }

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  const deleteFile = (id) => () => {
    deleteUploads(id).then(r => {
      getFiles();
    })
  }

  const toggleShare = (id, value) => () => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].id === id) {
        files[i].is_public = !value
        setFiles([...files])
        break;
      }
    }
    if (value) {
      makePrivate(id)
    } else {
      makePublic(id)
    }
  }

  return (
    <>
      {isOpen && <Upload isOpen={isOpen} onOpenChange={onOpenChange} onClose={onCloseDialog} />}
      <div className="flex h-full w-full flex-col gap-8 p-16">
        <div className="flex w-full items-center">
          <p className=" text-4xl font-bold">Files Dashboard - {files.length} files</p>
          <div className="flex-grow" />
          <Button color="primary" endContent={<BsUpload />} onClick={onOpen}>
            Upload
          </Button>
        </div>
        <div className="flex w-full items-center">
          <Table aria-label="Example static collection table">
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>UPLOAD DATE</TableColumn>
              <TableColumn>SIZE</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
              <TableColumn>SHARING</TableColumn>
            </TableHeader>
            <TableBody>
              {
                files.map(file => {
                  return <TableRow key={file.id}>
                    <TableCell>{file.name}</TableCell>
                    <TableCell>{(new Date(file.create_date)).toDateString()}</TableCell>
                    <TableCell>{formatBytes(file.size)}</TableCell>
                    <TableCell className="flex gap-2 items-center">
                      <Button size="sm" color="primary" onClick={() => downloadUploads(file.id, file.name)}>Download</Button>
                      <Button size="sm" color="danger" onClick={deleteFile(file.id)}  >Delete</Button>
                    </TableCell>
                    <TableCell>
                      <Switch defaultSelected={file.is_public} onValueChange={toggleShare(file.id, file.is_public)} />
                      {
                        file.is_public && <a href={`${import.meta.env.VITE_API_URL}/uploads/${file.id}/publicdownload`}>
                          link
                        </a>
                      }
                    </TableCell>
                  </TableRow>
                })
              }
            </TableBody>
          </Table>

        </div>
      </div>
    </>
  );
}
