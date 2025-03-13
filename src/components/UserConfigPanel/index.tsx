import {  Form, Input } from 'antd';
export function UserConfigPanel() {

  function pickColor(){
    utools.screenColorPick((e) => {
      console.log('e:',e);
      
    })
  }

  return (
    <Form name="user-config">
      <div className="flex justify-between p-5">
        <div className="flex flex-col">
          <Form.Item<{ 'background-color': string }>
            label="背景颜色"
            name="background-color"
            rules={[
              {
                required: true,
                message: 'pick a color'
              }
            ]}
          >
            <div className="flex items-center gap-4">
              <div className="w-7 h-7 bg-[#ff0] cursor-pointer" onClick={pickColor}></div>
              <Input className='flex-1' />
            </div>
          </Form.Item>
        </div>
        <div className="flex flex-col">
          <Form.Item<{ 'background-color1': string }> label="背景颜色" name="background-color1">
            <Input />
          </Form.Item>
        </div>
      </div>
    </Form>
  );
}
