import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  List, 
  Modal, 
  Input, 
  Select, 
  Typography
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  CameraOutlined,
  PictureOutlined,
  ShareAltOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

export default function MediaSocial() {
  const [items, setItems] = useState([
    { id: 1, name: 'Allow photo/video uploads', icon: <CameraOutlined />, enabled: true },
    { id: 2, name: 'Enable event gallery', icon: <PictureOutlined />, enabled: true },
    { id: 3, name: 'Enable social sharing', icon: <ShareAltOutlined />, enabled: true },
    { id: 4, name: 'live streaming', icon: <VideoCameraOutlined />, enabled: true },
  ]);

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Create form state
  const [createCategory, setCreateCategory] = useState('Media & Social');
  
  // Edit form state
  const [editName, setEditName] = useState('');
  const [editStatus, setEditStatus] = useState('');

  const handleCreate = () => {
    const formData = {
      category: createCategory
    };
    console.log('Create data:', formData);
    setCreateModalVisible(false);
    setCreateCategory('Media & Social');
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditName(item.name);
    setEditStatus(item.enabled ? 'allow' : 'disallow');
    setEditModalVisible(true);
  };

  const handleEditSubmit = () => {
    const formData = {
      id: selectedItem.id,
      name: editName,
      status: editStatus
    };
    console.log('Edit data:', formData);
    setEditModalVisible(false);
    setSelectedItem(null);
    setEditName('');
    setEditStatus('');
  };

  const handleRemove = (item) => {
    setSelectedItem(item);
    setRemoveModalVisible(true);
  };

  const confirmRemove = () => {
    console.log('Remove data:', selectedItem);
    setRemoveModalVisible(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <Card className=" mx-auto" bodyStyle={{ padding: '24px' }}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <PictureOutlined className="text-xl text-blue-500" />
            <Title level={4} className="m-0">Media & Social</Title>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            Add New
          </Button>
        </div>

        <List
          dataSource={items}
          renderItem={(item, index) => (
            <List.Item
              className={`py-4 ${index === items.length - 1 ? '' : 'border-b border-gray-200'}`}
              actions={[
                <Button
                  key="edit"
                  type="text"
                  icon={<EditOutlined />}
                  onClick={() => handleEdit(item)}
                  className="text-blue-500"
                />,
                <Button
                  key="delete"
                  type="text"
                  icon={<DeleteOutlined />}
                  onClick={() => handleRemove(item)}
                  className="text-red-500"
                />
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div className="text-lg text-gray-600 mr-2">
                    {item.icon}
                  </div>
                }
                title={
                  <span className="text-sm text-gray-800">
                    {index + 1}. {item.name}
                  </span>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* Create Modal */}
      <Modal
        title="Create Category"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          setCreateCategory('Media & Social');
        }}
        footer={null}
        width={400}
      >
        <div className="py-4">
          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Category
            </label>
            <Input 
              value={createCategory}
              onChange={(e) => setCreateCategory(e.target.value)}
              placeholder="Enter category name"
              className="bg-gray-100"
            />
          </div>
          
          <div className="mb-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center text-gray-500">
              <PictureOutlined className="text-2xl mb-2 block" />
              <div>With Media & Social</div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <Button onClick={() => {
              setCreateModalVisible(false);
              setCreateCategory('Media & Social');
            }}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleCreate}>
              Save
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Specialization"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedItem(null);
          setEditName('');
          setEditStatus('');
        }}
        footer={null}
        width={400}
      >
        <div className="py-4">
          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Specialization Name
            </label>
            <Input 
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="demo category" 
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">
              For Service
            </label>
            <Select 
              value={editStatus}
              onChange={(value) => setEditStatus(value)}
              placeholder="Select status"
              className="w-full"
            >
              <Option value="allow">Allow</Option>
              <Option value="disallow">Disallow</Option>
            </Select>
          </div>

          <div className="flex justify-between mt-6">
            <Button onClick={() => {
              setEditModalVisible(false);
              setSelectedItem(null);
              setEditName('');
              setEditStatus('');
            }}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleEditSubmit}>
              Save
            </Button>
          </div>
        </div>
      </Modal>

      {/* Remove Confirmation Modal */}
      <Modal
        title=""
        open={removeModalVisible}
        onCancel={() => {
          setRemoveModalVisible(false);
          setSelectedItem(null);
        }}
        footer={null}
        width={400}
        centered
      >
        <div className="text-center py-5">
          <Title level={4} className="mb-6">
            Do you want to Remove this?
          </Title>
          
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => {
                setRemoveModalVisible(false);
                setSelectedItem(null);
              }}
              className="min-w-20"
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              danger
              onClick={confirmRemove}
              className="min-w-20"
            >
              Yes, Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}