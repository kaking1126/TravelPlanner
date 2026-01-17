import React from 'react';
import { Card, Button } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { TravelSpot } from '../spots';

interface SpotDetailsProps {
  spot: TravelSpot;
  onAddToCart: (spot: TravelSpot) => void;
}

const SpotDetails: React.FC<SpotDetailsProps> = ({ spot, onAddToCart }) => {
  return (
    <Card
      cover={<img alt={spot.name} src={spot.imageUrl} />}
      actions={[
        <Button type="primary" icon={<ShoppingCartOutlined />} onClick={() => onAddToCart(spot)}>
          Add to Cart
        </Button>
      ]}
    >
      <Card.Meta
        title={spot.name}
        description={spot.description}
      />
    </Card>
  );
};

export default SpotDetails;
