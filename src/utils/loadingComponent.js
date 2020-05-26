import React from 'react'

import Dialog from '@material-ui/core/Dialog';
import { CircularProgress } from '@material-ui/core';

export default function LoadingComponent({loading}) {
    return (
        <Dialog open={loading}
        
        PaperProps={{
    style: {
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },
  }}>
        <div style={{width : 400, height : 400,   display : "flex",justifyContent : "center",alignItems : "center"}}> 
             <CircularProgress size={200} />
        </div>
          
        </Dialog>
    )
}
