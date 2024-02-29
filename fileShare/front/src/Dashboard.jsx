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

export default function Dashboard() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Upload isOpen={isOpen} onOpenChange={onOpenChange} />
      <div className="flex h-full w-full flex-col gap-8 p-16">
        <div className="flex w-full items-center">
          <p className=" text-4xl font-bold">Files Dashboard - 5 files</p>
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
              <TableRow key="1">
                <TableCell>Tony Reichert</TableCell>
                <TableCell>CEO</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>
                  {" "}
                  <Switch defaultSelected>Automatic updates</Switch>
                </TableCell>
              </TableRow>
              <TableRow key="3">
                <TableCell>Jane Fisher</TableCell>
                <TableCell>Senior Developer</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>
                  {" "}
                  <Switch defaultSelected>Automatic updates</Switch>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
