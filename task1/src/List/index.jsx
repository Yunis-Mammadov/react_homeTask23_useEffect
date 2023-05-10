import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

const List = () => {
  const [data, setData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [showDiscontinued, setShowDiscontinued] = useState(false);

  useEffect(() => {
    fetch("https://northwind.vercel.app/api/products")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  function handleInputChange(e) {
    setSearchItem(e.target.value);
  }

  function handleDiscontinued(e) {
    e.preventDefault();
    setShowDiscontinued(!showDiscontinued);
  }

  function handleSortPrice(e) {
    e.preventDefault();
    let sortedUnitPrice = [...data].sort((a, b) => a.unitPrice - b.unitPrice);
    setSortedData(sortedUnitPrice);
  }

  async function handleDelete(id) {
    try {
      const response = await fetch(`https://northwind.vercel.app/api/products/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setData(data.filter((item) => item.id !== id));
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  const filteredData = (sortedData.length > 0 ? sortedData : data)
    .filter((item) => {
      if (showDiscontinued) {
        return item.discontinued;
      } else {
        return true;
      }
    })
    .filter((item) => item.name.toLowerCase().includes(searchItem.toLowerCase()))
    .map((item) => (
      <Card key={item.id}>
        <Card.Header as="h5">Name: {item.name}</Card.Header>
        <Card.Body>
          <Card.Text>Unit Price: {item.unitPrice}</Card.Text>
          <Button variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
        </Card.Body>
      </Card>
    ));

  return (
    <>
      <form>
        <input
          type="text"
          value={searchItem}
          onChange={(e) => handleInputChange(e)}
        />
        <button onClick={(e) => handleDiscontinued(e)}>
          {showDiscontinued ? "Hide Discontinued" : "Show Discontinued"}
        </button>
        <button type="submit" onClick={(e) => handleSortPrice(e)}>
          Unit Price
        </button>
      </form>
      {filteredData}
    </>
  );
};

export default List;
