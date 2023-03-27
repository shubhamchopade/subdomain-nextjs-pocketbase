import { useEffect, useState } from "react";
import PocketBase from "pocketbase";

export default function UploadForm(props) {
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState<string>();
  const [imageRecords, setImageRecords] = useState([]);

  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

  const uploadToClient = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];
      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
      const body = new FormData();
      body.append("img", i);
      const record = await pb
        .collection("static")
        .create(body, { $autoCancel: false });
      console.log(record);
    }
  };

  useEffect(() => {
    const getRecords = async () => {
      const records = await pb
        .collection("static")
        .getFullList({ $autoCancel: false });
      console.log(records);
      const urls = records.map((record) => {
        return pb.getFileUrl(record, record.img[0]);
      });
      setImageRecords(urls);
      console.log(urls);
    };
    getRecords();
  }, []);

  return (
    <div>
      <div>
        {imageRecords.map((record) => {
          return <img key={record.id} src={record} />;
        })}
        <h4>Select Image</h4>
        <input type="file" name="myImage" onChange={uploadToClient} />
      </div>
    </div>
  );
}
