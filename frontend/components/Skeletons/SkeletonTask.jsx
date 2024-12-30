import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';

const SkeletonTask = () => (
    <ContentLoader
        speed={2}
        width={150}
        height={170}
        viewBox="0 0 150 170"
        backgroundColor="#e0e0e064"
        foregroundColor="#eef1e3"
    >
        <Rect x="0" y="0" rx="25" ry="25" width="150" height="170" />
    </ContentLoader>
);

export default SkeletonTask;