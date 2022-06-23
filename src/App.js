import "./App.css";
import { inject, observer } from "mobx-react";
import { useEffect, useState, useRef } from "react";
import {
  List,
  Avatar,
  Button,
  Modal,
  Input,
  Form,
  Card,
  Row,
  Col,
  Typography,
} from "antd";

function App({ store }) {
  const commentStore = store;
  // console.log(store.toJSON(), "store");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const showModal = () => {
    setIsModalVisible(true);
  };

  const topComment = {};
  commentStore.comments.forEach((item) => {
    topComment[item.name] = (topComment[item.name] || 0) + 1;
  });
  // console.log(topComment);

  const sorted = [];
  for (const name in topComment) {
    sorted.push({ name, count: topComment[name] });
  }
  sorted.sort((a, b) => {
    return b.count - a.count;
  });

  const topCommenters = sorted.slice(0, 3);

  const { Title } = Typography;
  const { TextArea } = Input;
  const { Meta } = Card;

  const onFinish = (values, e) => {
    console.log("Success:", values);
    setIsModalVisible(false);
    store.addComment(values);
    form.resetFields();
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    commentStore.getComments();
  }, [commentStore]);
  // console.log(commentStore.toJSON(), "comment console on app");

  return (
    <>
      <div className="App">
        <Row style={{ paddingLeft: 10, paddingRight: 10 }}>
          <Col className="commentsList" span={16}>
            <Title className="title1">Comments</Title>
            <Button type="primary" onClick={showModal}>
              Add a Comment
            </Button>
            <Modal
              // className="modalComment"
              title="Add A Comment"
              visible={isModalVisible}
              onCancel={handleCancel}
              footer={null}
            >
              <Form
                form={form}
                name="basic"
                initialValues={{
                  remember: false,
                }}
                layout="vertical"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your name!",
                    },
                  ]}
                >
                  <Input allowClear />
                </Form.Item>
                <Form.Item
                  label="body"
                  name="body"
                  rules={[
                    {
                      required: true,
                      message: "Please input your comment!",
                    },
                  ]}
                >
                  <TextArea allowClear />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </Modal>

            <List
              loading={commentStore.loading}
              header={`${commentStore.comments.length} Comments`}
              itemLayout="horizontal"
              dataSource={commentStore.comments.toJSON()}
              renderItem={(item) => (
                <Card hoverable style={{ marginBottom: 10 }}>
                  <Meta
                    avatar={
                      <Avatar>{`${item.name
                        .split("")[0]
                        .split("")[0]
                        .toUpperCase()}${item.name
                        .split(" ")
                        [item.name.split(" ").length - 1].split("")[0]
                        .toUpperCase()}`}</Avatar>
                    }
                    title={
                      item.name.charAt(0).toUpperCase() + item.name.slice(1)
                    }
                    description={item.body}
                  />
                </Card>
              )}
            />
          </Col>
          <Col span={8}>
            <Title className="title2" level={2}>
              Top 3 Commenter
            </Title>
            <List
              loading={commentStore.loading}
              itemLayout="horizontal"
              dataSource={topCommenters}
              renderItem={(item) => (
                <Card hoverable style={{ marginBottom: 10, marginLeft: 10 }}>
                  <Meta
                    avatar={
                      <Avatar>{`${item.name
                        .split("")[0]
                        .split("")[0]
                        .toUpperCase()}${item.name
                        .split(" ")
                        [item.name.split(" ").length - 1].split("")[0]
                        .toUpperCase()}`}</Avatar>
                    }
                    title={
                      item.name.charAt(0).toUpperCase() + item.name.slice(1)
                    }
                    description={`${item.count} Comments`}
                  />
                </Card>
              )}
            />
          </Col>
        </Row>
      </div>
    </>
  );
}

export default inject("store")(observer(App));
