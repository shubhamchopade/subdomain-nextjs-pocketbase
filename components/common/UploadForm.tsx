import { useEffect, useState } from "react";
import PocketBase from "pocketbase";

export default function UploadForm(props) {
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState(null);
  const [imageRecords, setImageRecords] = useState([]);

  const pb = new PocketBase("https://pocketbase.techsapien.dev");

  const uploadToClient = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      //   const formData = new FormData();
      //   formData.append("name", "John Doe");
      //   formData.append("email", "johndoe@example.com");
      //   formData.append("file", i); // where 'file' is the file you want to upload

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

  const uploadToServer = async (event) => {
    // console.log("file", image)
    // const response = await fetch(
    //   `${process.env.NEXT_AUTH_API}/api/collections/static/records`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //     body,
    //   }
    // );
    // const data = await response.json();
  };
  console.log(imageRecords);

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
      //   const url = pb.getFileUrl(records, records.collectionName);
      //   setImageRecords(url);
    };
    getRecords();
  }, []);

  return (
    <div>
      <div>
        {imageRecords.map((record) => {
          return <img key={record.id} src={record} />;
        })}
        {/* <img src={createObjectURL} /> */}
        <h4>Select Image</h4>
        <input type="file" name="myImage" onChange={uploadToClient} />
        {/* <button
          className="btn btn-primary"
          type="submit"
          onClick={uploadToServer}
        >
          Send to server
        </button> */}
      </div>
    </div>
  );
}
